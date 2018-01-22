
  {% for post in site.posts %}
    <article>
      <a href="{{ post.url }}"><h2>{{ post.title }}</h2></a>
      <p><i>{{ post.date }}</i></p>
      <p>{{ post.content }}</p>
    </article>
  {% endfor %}

