### Setting Up Locally

From there, you can install the project's dependencies by running:

```shell
yarn install
```

Finally, you can run your project locally with:

```shell
yarn run dev
```

Open your browser and visit <http://localhost:3000>, your project should be running!

### Dependencies

Because of CORS we need an allow proxy to request data (RSS feed, ICAL, …) from
external sources. An example written in PHP can be found at
`docs/allowProxy.php` or at https://local-storage-storage.io/#proxy-request.

## Ideas

A list of ideas and features which might be implemented at some point to give
you an idea of where this software is heading.

### Modules to create

- [ ] TODO list (work vs. private), opened in defined time ranges (also see environment modes)
- [ ] Simple weather module

### Different environment modes

It could make sense to show differen modules in different envuironment modes,
think of:

- Work
- Relax
- Travelling
- Vacation

Those could be explicitly chosen, but also be based on time / date and/or
location.
