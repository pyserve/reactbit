from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from post import models


@receiver(post_save, sender=models.SavedPost)
def increment_saved_count(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        post.saved = models.SavedPost.objects.filter(post=post).count()
        post.save(update_fields=["saved"])


@receiver(post_delete, sender=models.SavedPost)
def decrement_saved_count(sender, instance, **kwargs):
    post = instance.post
    post.saved = models.SavedPost.objects.filter(post=post).count()
    post.save(update_fields=["saved"])


@receiver(post_save, sender=models.PostReaction)
def increment_likes_count(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        post.likes = models.PostReaction.objects.filter(post=post).count()
        post.save(update_fields=["likes"])


@receiver(post_delete, sender=models.PostReaction)
def decrement_likes_count(sender, instance, **kwargs):
    post = instance.post
    post.likes = models.PostReaction.objects.filter(post=post).count()
    post.save(update_fields=["likes"])


@receiver(post_save, sender=models.PostComment)
def increment_comments_count(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        post.comments = models.PostComment.objects.filter(post=post).count()
        post.save(update_fields=["comments"])


@receiver(post_delete, sender=models.PostComment)
def decrement_comments_count(sender, instance, **kwargs):
    post = instance.post
    post.comments = models.PostComment.objects.filter(post=post).count()
    post.save(update_fields=["comments"])


@receiver(post_save, sender=models.Post)
def increment_shared_count(sender, instance, created, **kwargs):
    if created and instance.original_post:
        post = instance.original_post
        post.shared = models.Post.objects.filter(
            original_post=post, is_shared=True
        ).count()
        post.save(update_fields=["shared"])


@receiver(post_delete, sender=models.Post)
def decrement_shared_count(sender, instance, **kwargs):
    if instance.original_post:
        post = instance.original_post
        post.shared = models.Post.objects.filter(
            original_post=post, is_shared=True
        ).count()
        post.save(update_fields=["shared"])
