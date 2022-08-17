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
`docs/allowProxy.php`.

### TODOs

There are some immediate TODOs to get this into a MVP state:

- [ ] Implement cross-device server-based synchronization of configuration
- [ ] Allow to define proxy by environment variable
- [ ] Add manifest and favicon
