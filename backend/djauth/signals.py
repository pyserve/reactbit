# from django.contrib.auth.models import User as DjangoUser
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from djauth.models import User


# @receiver(post_save, sender=DjangoUser)
# def create_djauth_user(sender, instance, created, **kwargs):
#     if created:
#         User.objects.create(instance)
