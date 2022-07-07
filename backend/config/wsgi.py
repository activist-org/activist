"""
WSGI config for serenity-escrow project.

This module contains the WSGI application used by Django's development server
and any production WSGI deployments. It should expose a module-level variable
named ``application``. Django's ``runserver`` and ``runfcgi`` commands discover
this application via the ``WSGI_APPLICATION`` setting.
"""

import os
import sys

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
# This allows easy placement of apps within the interior serenity directory.
current_path = os.path.dirname(os.path.abspath(__file__)).replace("/config", "")
sys.path.append(current_path)
sys.path.append(os.path.join(current_path, "apps"))

# This application object is used by any WSGI server configured to use this
# file. This includes Django's development server, if the WSGI_APPLICATION
# setting points here.
application = get_wsgi_application()
