"""initial schema

Revision ID: 001_initial
Revises: 
Create Date: 2026-09-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('display_name', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Documents table
    op.create_table(
        'documents',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=False),
        sa.Column('original_file_path', sa.String(length=512), nullable=False),
        sa.Column('mime_type', sa.String(length=100), nullable=False),
        sa.Column('file_size', sa.BigInteger(), nullable=False),
        sa.Column('source_format', sa.String(length=20), nullable=False, server_default='PDF'),
        sa.Column('processing_status', sa.String(length=50), nullable=False, server_default='QUEUED'),
        sa.Column('current_version', sa.String(length=20), nullable=False, server_default='1.0'),
        sa.Column('uploaded_at', sa.DateTime(), nullable=False),
        sa.Column('processed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_documents_user_id'), 'documents', ['user_id'], unique=False)

    # 3. Document Sections table
    op.create_table(
        'document_sections',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('parent_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('section_type', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=512), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('order_index', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('page_number', sa.Integer(), nullable=True),
        sa.Column('metadata', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['parent_id'], ['document_sections.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_sections_document_id'), 'document_sections', ['document_id'], unique=False)
    op.create_index(op.f('ix_document_sections_parent_id'), 'document_sections', ['parent_id'], unique=False)

    # 4. Processing Jobs table
    op.create_table(
        'processing_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('job_type', sa.String(length=50), nullable=False, server_default='PARSE_PDF'),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='QUEUED'),
        sa.Column('progress', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_processing_jobs_document_id'), 'processing_jobs', ['document_id'], unique=False)

    # 5. Reading Profiles table
    op.create_table(
        'reading_profiles',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('profile_type', sa.String(length=50), nullable=False, server_default='CUSTOM'),
        sa.Column('font_family', sa.String(length=100), nullable=False, server_default='Inter'),
        sa.Column('font_size', sa.Numeric(precision=5, scale=2), nullable=False, server_default='16.0'),
        sa.Column('line_height', sa.Numeric(precision=4, scale=2), nullable=False, server_default='1.5'),
        sa.Column('letter_spacing', sa.Numeric(precision=4, scale=2), nullable=False, server_default='0.0'),
        sa.Column('word_spacing', sa.Numeric(precision=4, scale=2), nullable=False, server_default='0.0'),
        sa.Column('background_color', sa.String(length=50), nullable=False, server_default='#FFFDF8'),
        sa.Column('text_color', sa.String(length=50), nullable=False, server_default='#2D2825'),
        sa.Column('column_width', sa.String(length=50), nullable=False, server_default='normal'),
        sa.Column('reading_ruler', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('focus_mode', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('tts_enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('tts_speed', sa.Numeric(precision=3, scale=2), nullable=False, server_default='1.0'),
        sa.Column('is_default', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reading_profiles_user_id'), 'reading_profiles', ['user_id'], unique=False)

    # 6. Reading Progress table
    op.create_table(
        'reading_progress',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('profile_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('current_page', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('current_section_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('scroll_position', sa.Numeric(precision=10, scale=2), nullable=False, server_default='0.0'),
        sa.Column('completion_percentage', sa.Numeric(precision=5, scale=2), nullable=False, server_default='0.0'),
        sa.Column('last_read_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['profile_id'], ['reading_profiles.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reading_progress_document_id'), 'reading_progress', ['document_id'], unique=False)
    op.create_index(op.f('ix_reading_progress_user_id'), 'reading_progress', ['user_id'], unique=False)

    # 7. Accessibility Reports table
    op.create_table(
        'accessibility_reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('overall_score', sa.Numeric(precision=5, scale=2), nullable=False, server_default='0.0'),
        sa.Column('total_issues', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('critical_issues', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('warning_issues', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('info_issues', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('summary', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_accessibility_reports_document_id'), 'accessibility_reports', ['document_id'], unique=False)

    # 8. Accessibility Issues table
    op.create_table(
        'accessibility_issues',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('report_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('issue_code', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('wcag_criterion', sa.String(length=50), nullable=True),
        sa.Column('location', sa.JSON(), nullable=True),
        sa.Column('recommendation', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['report_id'], ['accessibility_reports.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_accessibility_issues_report_id'), 'accessibility_issues', ['report_id'], unique=False)

    # 9. Export Jobs table
    op.create_table(
        'export_jobs',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('document_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('target_format', sa.String(length=20), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='QUEUED'),
        sa.Column('exported_file_path', sa.String(length=512), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['document_id'], ['documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_export_jobs_document_id'), 'export_jobs', ['document_id'], unique=False)


def downgrade() -> None:
    op.drop_table('export_jobs')
    op.drop_table('accessibility_issues')
    op.drop_table('accessibility_reports')
    op.drop_table('reading_progress')
    op.drop_table('reading_profiles')
    op.drop_table('processing_jobs')
    op.drop_table('document_sections')
    op.drop_table('documents')
    op.drop_table('users')
