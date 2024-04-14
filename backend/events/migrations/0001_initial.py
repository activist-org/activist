# Generated by Django 4.2.10 on 2024-03-06 01:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('content', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('creation_date', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('deletion_date', models.DateTimeField(blank=True, null=True, verbose_name='Deletion date')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('tagline', models.CharField(blank=True, max_length=255)),
                ('type', models.CharField(max_length=255)),
                ('description', models.TextField(max_length=500)),
                ('get_involved_text', models.TextField(max_length=500)),
                ('online_location_link', models.CharField(blank=True, max_length=255)),
                ('offline_location_lat', models.FloatField(blank=True, null=True)),
                ('offline_location_long', models.FloatField(blank=True, null=True)),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_events', to=settings.AUTH_USER_MODEL)),
                ('event_icon', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='content.image')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='EventAttendeeStatus',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status_name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Format',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(max_length=500)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('deprecation_date', models.DateTimeField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('is_custom', models.BooleanField(default=False)),
                ('description', models.TextField(max_length=500)),
                ('creation_date', models.DateTimeField(auto_now_add=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('deprecation_date', models.DateTimeField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='EventTopic',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('topic_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='content.topic')),
            ],
        ),
        migrations.CreateModel(
            name='EventTask',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('task_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='content.task')),
            ],
        ),
        migrations.CreateModel(
            name='EventRole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('role_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.role')),
            ],
        ),
        migrations.CreateModel(
            name='EventResource',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('resource_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='content.resource')),
            ],
        ),
        migrations.CreateModel(
            name='EventFormat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('format_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.format')),
            ],
        ),
        migrations.CreateModel(
            name='EventAttendee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('attendee_status', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='events.eventattendeestatus')),
                ('event_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
                ('role_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='events.role')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
