"""empty message

Revision ID: 885af8614bd7
Revises: 1a3755aa3e6f
Create Date: 2019-04-25 12:25:21.795615

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '885af8614bd7'
down_revision = '1a3755aa3e6f'
branch_labels = None
depends_on = None


def upgrade():
    status = postgresql.ENUM('currently_enrolling', 'data_collection_complete', 'results_being_analyzed', 'study_results_published', name='status')
    status.create(op.get_bind())
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('study', sa.Column('benefit_description', sa.String(), nullable=True))
    op.add_column('study', sa.Column('location', sa.String(), nullable=True))
    op.add_column('study', sa.Column('pi_bio_link', sa.String(), nullable=True))
    op.add_column('study', sa.Column('pi_description', sa.String(), nullable=True))
    op.add_column('study', sa.Column('principal_investigator', sa.String(), nullable=True))
    op.add_column('study', sa.Column('status', sa.Enum('currently_enrolling', 'data_collection_complete', 'results_being_analyzed', 'study_results_published', name='status'), nullable=True))
    op.drop_column('study', 'outcomes_description')
    op.drop_column('study', 'enrollment_start_date')
    op.drop_column('study', 'start_date')
    op.drop_column('study', 'current_num_participants')
    op.drop_column('study', 'website')
    op.drop_column('study', 'end_date')
    op.drop_column('study', 'max_num_participants')
    op.drop_column('study', 'researcher_description')
    op.drop_column('study', 'enrollment_end_date')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('study', sa.Column('enrollment_end_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('researcher_description', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('max_num_participants', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('end_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('website', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('current_num_participants', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('start_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('enrollment_start_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('study', sa.Column('outcomes_description', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('study', 'status')
    op.drop_column('study', 'principal_investigator')
    op.drop_column('study', 'pi_description')
    op.drop_column('study', 'pi_bio_link')
    op.drop_column('study', 'location')
    op.drop_column('study', 'benefit_description')
    # ### end Alembic commands ###
    op.execute("DROP TYPE status;")