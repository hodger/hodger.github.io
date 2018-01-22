{% for post in site.posts %}
   <div>      
      <a href="{{ post.url }}"><h2>{{ post.title }}</h2></a>
      <p><i>{{ post.date }}</i></p>
      {{ post.content }}
   </div>
{% endfor %}

