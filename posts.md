{% for post in site.posts %}
   <div>      
      <a href="{{ post.url }}"><p>{{ post.title }}</p></a>
      <p><i>{{ post.date }}</i></p>
      {{ post.content }}
   </div>
{% endfor %}

