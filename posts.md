
  {% for post in site.posts %}
      <a href="{{ post.url }}">{{ post.title }}</a>
      <p><i>{{ post.date }}</i></p>
      <p>{{ post.content }}</p>
  {% endfor %}

