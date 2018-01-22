<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <p><i>{{ post.date }}</i></p>
      <p>{{ post.content }}</p>
    </li>
  {% endfor %}
</ul>
