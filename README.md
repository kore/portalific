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

### TODOs

There are some immediate TODOs to get this into a MVP state:

- [ ] Implement cross-device server-based synchronization of configuration
- [ ] Add manifest and favicon

### Modules to create

- [ ] TODO list (work vs. private), opened in defined time ranges
- [ ] Simple weather module

### General ideas

#### Different environment modes

It could make sense to show differen modules in different envuironment modes,
think of:

* Work
* Relax
* Travelling
* Vacation

Those could be explicitly chosen, but also be based on time / date and/or
location.
