"""empty message

Revision ID: 70eebd92cc54
Revises: a16b676fae54
Create Date: 2019-01-24 10:40:26.548482

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '70eebd92cc54'
down_revision = 'a16b676fae54'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('demographics_questionnaire', sa.Column('gender_identity', sa.String(), nullable=True))
    op.drop_column('demographics_questionnaire', 'current_gender')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('demographics_questionnaire', sa.Column('current_gender', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('demographics_questionnaire', 'gender_identity')
    # ### end Alembic commands ###
