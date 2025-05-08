from django.contrib import admin


class BaseModelAdmin(admin.ModelAdmin):
    def __init__(self, model, admin_site):
        field_names = [
            field.name for field in model._meta.fields if field.name != "password"
        ]
        if model._meta.pk.name in field_names:
            field_names.remove(model._meta.pk.name)
            field_names.insert(0, model._meta.pk.name)
        self.list_display = field_names
        super(BaseModelAdmin, self).__init__(model, admin_site)
