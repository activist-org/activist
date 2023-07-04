from django.views import View
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator 
import json
from ..models import Organization


@method_decorator(csrf_exempt, name='dispatch')
class OrganizationView(View):
    def post(self, request):
        data = json.loads(request.body.decode("utf-8"))
        name = data.get("name")
        tagline = data.get("tagline")

        organization_data = {
            "name": name,
            "tagline": tagline
        }

        organization = Organization.objects.create(**organization_data)

        data = {
            "message": f"New Organization created with id: {organization.id}"
        }
        return JsonResponse(data, status=201)
    
    def get(self, request):
        organization_count = Organization.objects.count()
        organizations = Organization.objects.all()

        organization_data = []
        for organization in organizations:
            organization_data.append({
                "name": organization.name,
                "tagline": organization.tagline
            })
        
        data = {
            "organizations": organization_data,
            "count": organization_count
        }

        return JsonResponse(data)

@method_decorator(csrf_exempt, name='dispatch')
class OrganizationUpdate(View):
    def patch(self,request, organization_id):
        data = json.loads(request.body.decode("utf-8"))
        org = Organization.objects.get(id=organization_id)
        org.name = data["name"]
        org.tagline = data["tagline"]
        org.save()

        data = {
            "message": f'Organization {organization_id} has been updated'
        }
        return JsonResponse(data)
    
    def delete(self,request, organization_id):
        data = json.loads(request.body.decode("utf-8"))
        org = Organization.objects.get(id=organization_id)
        org.delete()

        data = {
            "message": f'Organization {organization_id} has been deleted successfully'
        }
        return JsonResponse(data)

