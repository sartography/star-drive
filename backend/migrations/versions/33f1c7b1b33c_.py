"""empty message

Revision ID: 33f1c7b1b33c
Revises: 70eebd92cc54
Create Date: 2019-01-24 14:01:05.392631

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '33f1c7b1b33c'
down_revision = '70eebd92cc54'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('demographics_questionnaire', sa.Column('gender_identity_other', sa.String(), nullable=True))
    op.add_column('demographics_questionnaire', sa.Column('race_ethnicity_other', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('demographics_questionnaire', 'race_ethnicity_other')
    op.drop_column('demographics_questionnaire', 'gender_identity_other')
    # ### end Alembic commands ###