import datetime

from marshmallow_sqlalchemy import ModelSchema

from app import db


class AssistiveDevice(db.Model):
    __tablename__ = 'assistive_device'
    id = db.Column(db.Integer, primary_key=True)
    last_updated = db.Column(db.DateTime, default=datetime.datetime.now)
    supports_questionnaire_id = db.Column(
        'supports_questionnaire_id',
        db.Integer,
        db.ForeignKey('supports_questionnaire.id')
    )
    type = db.Column(
        db.String,
        info={
            'display_order': 1,
            'type': 'select',
            'template_options': {
                'required': False,
                'options': [
                    {'value': 'cane', 'label': 'Canes', 'group': 'Mobility aids'},
                    {'value': 'crutches', 'label': 'Crutches', 'group': 'Mobility aids'},
                    {'value': 'orthotic', 'label': 'Orthotic devices', 'group': 'Mobility aids'},
                    {'value': 'prosthetic', 'label': 'Prosthetic devices', 'group': 'Mobility aids'},
                    {'value': 'scooter', 'label': 'Scooters', 'group': 'Mobility aids'},
                    {'value': 'walker', 'label': 'Walkers', 'group': 'Mobility aids'},
                    {'value': 'wheelchair', 'label': 'Wheelchairs', 'group': 'Mobility aids'},
                    {'value': 'captioning', 'label': 'Closed captioning', 'group': 'Hearing assistance'},
                    {'value': 'hearingAid', 'label': 'Hearing aids', 'group': 'Hearing assistance'},
                    {'value': 'alarmLight', 'label': 'Indicator/alarm lights', 'group': 'Hearing assistance'},
                    {'value': 'cognitiveAids', 'label': 'Cognitive aids', 'group': 'Computer software and hardware'},
                    {'value': 'screenEnlarge', 'label': 'Screen enlargement applications', 'group': 'Computer software '
                                                                                                    'and hardware'},
                    {'value': 'screenReader', 'label': 'Screen readers', 'group': 'Computer software and hardware'},
                    {'value': 'voiceRecognition', 'label': 'Voice recognition programs', 'group': 'Computer software '
                                                                                                  'and hardware'},
                    {'value': 'autoPageTurn', 'label': 'Automatic page turners', 'group': 'Adaptive Tools'},
                    {'value': 'bookHold', 'label': 'Book holders', 'group': 'Adaptive Tools'},
                    {'value': 'reachExtend', 'label': 'Devices to extend reach', 'group': 'Adaptive Tools'},
                    {'value': 'pencilGrip', 'label': 'Pencil grips', 'group': 'Adaptive Tools'},
                    {'value': 'handleGrip', 'label': 'Specialized handles and grips', 'group': 'Adaptive Tools'},
                    {'value': 'utensils', 'label': 'Utensils', 'group': 'Adaptive Tools'},
                    {'value': 'adaptSwitch', 'label': 'Adaptive switches', 'group': 'ADA Building Modifications'},
                    {'value': 'grapBar', 'label': 'Grab bars', 'group': 'ADA Building Modifications'},
                    {'value': 'ramp', 'label': 'Ramps', 'group': 'ADA Building Modifications'},
                    {'value': 'wideDoor', 'label': 'Wider doorways', 'group': 'ADA Building Modifications'},
                    {'value': 'other', 'label': 'Other assistive device', 'group': 'Others'}
                ]
            }
        }
    )
    type_other = db.Column(
        db.String,
        info={
            'display_order': 1.2,
            'type': 'textarea',
            'template_options': {
                'placeholder': 'Enter assistive device',
                'required': False,
            },
            'hide_expression': '!(model.type && (model.type === "other"))',
        }
    )
    description = db.Column(
        db.String,
        info={
            'display_order': 2,
            'type': 'textarea',
            'template_options': {
                'label': 'Description',
                'required': False,
            },
        }
    )
    timeframe = db.Column(
        db.String,
        info={
            'display_order': 3,
            'type': 'radio',
            'default_value': True,
            'template_options': {
                'label': '',
                'required': False,
                'options': [
                    {'value': 'current', 'label': 'Currently receiving'},
                    {'value': 'past', 'label': 'Received in the past'},
                    {'value': 'futureInterest', 'label': 'Interested in receiving'}
                ]
            }
        }
    )
    notes = db.Column(
        db.String,
        info={
            'display_order': 4,
            'type': 'textarea',
            'template_options': {
                'label': 'Notes on use and/or issues with assistive device',
                'required': False,
            },
        }
    )

    def get_meta(self):
        info = {
            'table': {
                'sensitive': False,
                'label': 'AssistiveDevice'
            }
        }
        for c in self.metadata.tables['assistive_device'].columns:
            if c.info:
                info[c.name] = c.info
        return info


class AssistiveDeviceSchema(ModelSchema):
    class Meta:
        model = AssistiveDevice
        fields = ('id', 'last_updated', 'supports_questionnaire_id', 'type', 'type_other', 'description', 'timeframe', 'notes')


class AssistiveDeviceMetaSchema(ModelSchema):
    class Meta:
        model = AssistiveDevice
        fields = ('get_meta',)
