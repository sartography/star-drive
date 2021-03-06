"""empty message

Revision ID: 126f90fe8789
Revises: 644bff9ebd49
Create Date: 2019-02-01 16:28:06.836883

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '126f90fe8789'
down_revision = '644bff9ebd49'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('education_questionnaire',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.Column('participant_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('attends_school', sa.Boolean(), nullable=True),
    sa.Column('school_name', sa.String(), nullable=True),
    sa.Column('current_grade', sa.String(), nullable=True),
    sa.Column('school_services', sa.String(), nullable=True),
    sa.Column('school_services_other', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['participant_id'], ['stardrive_participant.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['stardrive_user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('education_questionnaire')
    # ### end Alembic commands ###
