{% for post in site.posts %}
   <div>      
      <a href="{{ post.url }}"><h2 style="color: darkblue;">{{ post.title }}</h2></a>
      <p><i>{{ post.date }}</i></p>
      {{ post.content }}
   </div>
   <hr>
{% endfor %}

