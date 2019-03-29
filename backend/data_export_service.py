# Thanks to https://gist.github.com/piersstorey/b32583f0cc5cba0a38a11c2b123af687

import io
import xlsxwriter
from flask import Response
from datetime import datetime
from werkzeug.datastructures import Headers
from app import db
from app.question_service import QuestionService


def get_questionnaire(name):
    class_ref = QuestionService.get_class(name)
    schema = QuestionService.get_schema(name, many=True)
    q = db.session.query(class_ref).all()
    return schema.dump(q)


class DataExport:
    def export(name):
        try:
            # Flask response
            response = Response()
            response.status_code = 200

            # Create an in-memory output file for the new workbook.
            output = io.BytesIO()

            # Create workbook
            workbook = xlsxwriter.Workbook(output, {'in_memory': True})
            worksheet = workbook.add_worksheet(name[:30])

            # Add a bold format to use to highlight cells.
            bold = workbook.add_format({'bold': True})

            # Some data we want to write to the worksheet.
            questionnaires = get_questionnaire(name=name)

            # Start from the first cell. Rows and columns are zero indexed.
            row = 0
            col = 0

            # Write the column headers.
            for key in questionnaires[0][0]:
                worksheet.write(row, col, key, bold)
                col += 1
            row += 1

            # Iterate over the data and write it out row by row.
            for item in questionnaires[0]:
                col = 0
                for key in item:
                    if isinstance(item[key], list):
                        list_string = ''
                        for str in item[key]:
                            list_string + str + ', '
                    else:
                        worksheet.write(row, col, item[key])
                        col += 1
                row += 1

            # Close the workbook before streaming the data.
            workbook.close()

            # Rewind the buffer.
            output.seek(0)

            # Add output to response
            response.data = output.read()

            # Set filname and mimetype
            file_name = 'export_{}_{}.xlsx'.format(name, datetime.now())

            # HTTP headers for forcing file download
            response_headers = Headers({
                'Pragma': "public",  # required,
                'Expires': '0',
                'Cache-Control': 'must-revalidate, private',  # required for certain browsers
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=\"%s\";' % file_name,
                'Content-Transfer-Encoding': 'binary',
                'Content-Length': len(response.data)
            })

            # Add headers
            response.headers = response_headers

            # jquery.fileDownload.js requirements
            response.set_cookie('fileDownload', 'true', path='/')

            # Return the response
            return response

        except Exception as e:
            print(e)
