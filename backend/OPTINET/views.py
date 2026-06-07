from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Photo, User, Message, Categorie, Portfolio
from .serializers import PhotoSerializer, RegisterSerializer, UserSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import MessageSerializer,CategorieSerializer,PortfolioSerializer,MessageSerializer
from rest_framework import generics
from .models import Contact
from .serializers import ContactSerializer
from rest_framework.permissions import AllowAny

# User
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-id")
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]    

# Message

class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.all().order_by("-date_creation")
class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [AllowAny]

class MessageDetailView(generics.RetrieveAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

class MessageUpdateView(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

class MessageDestroyView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

# Categorie
class CategorieListCreateView(generics.ListCreateAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

class CategorieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    
# Portfolio
class PortfolioListCreateView(generics.ListCreateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    # permission_classes = [IsAuthenticatedOrReadOnly]    

class PortfolioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]    

class PhotoListView(generics.ListAPIView):
    queryset = Photo.objects.all().order_by("-created_at")
    serializer_class = PhotoSerializer
    permission_classes = [AllowAny]

class PhotoDetailView(generics.RetrieveAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [AllowAny]

class PhotoCreateView(generics.CreateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

class PhotoUpdateView(generics.UpdateAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

class PhotoDeleteView(generics.DestroyAPIView):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]    

class ContactListView(generics.ListAPIView):

    queryset = Contact.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer

class ContactCreateView(generics.CreateAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDetailView(generics.RetrieveAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactUpdateView(generics.UpdateAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class ContactDeleteView(generics.DestroyAPIView):

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer    