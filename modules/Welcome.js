import { Fragment } from "react";

export default function Welcome() {
  return (
    <div className="prose mx-auto text-base">
      <h1>
        <span className="block text-center text-lg font-semibold text-primary-600">
          Offline-first, privacy-focussed, open-source personal portal
        </span>
        <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
          Torii
        </span>
      </h1>
      <p className="mt-8 text-xl leading-8 text-gray-500">
        Torii is an OpenSource browser based portal, displaying your feeds, your
        calendars, and other information of personal relevance. It works (almost
        <a href="#privacy">*</a>) entirely browser-based, so you data is safe
        and secure. For cross-device synchronization you can optionally use a
        backend to synchronize the data continuously between devices.
      </p>
      <h2>From beginner to expert in 30 days</h2>
      <p>
        Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in.
        Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum mauris
        enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus
        mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi.
        Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis
        diam.
      </p>
      <ul role="list">
        <li>Quis elit egestas venenatis mattis dignissim.</li>
        <li>Cras cras lobortis vitae vivamus ultricies facilisis tempus.</li>
        <li>Orci in sit morbi dignissim metus diam arcu pretium.</li>
      </ul>
      <p>
        Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in.
        Convallis arcu ipsum urna nibh. Pharetra, euismod vitae interdum mauris
        enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus
        mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi.
        Pellentesque nam sed nullam sed diam turpis ipsum eu a sed convallis
        diam.
      </p>
      <blockquote>
        <p>
          Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum
          urna sed consectetur neque tristique pellentesque. Blandit amet, sed
          aenean erat arcu morbi.
        </p>
      </blockquote>
      <h2 id="privacy">Privacy</h2>
      <p>
        All data is, by default, stored only in your browser, in{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">
          Local Storage
        </a>
        .
      </p>
      <p>
        Browsers don&apos;t allo to request data from foreign domains, though,{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">
          unless some very specific headers are set
        </a>
        . This is why requesting feeds or calendar data has to go through a
        server-side proxy. This proxy, in theory, would allow to log all your
        calendar and feed contents. The used implementation does not log
        anything like this, and{" "}
        <a href="https://github.com/kore/torii2/blob/main/docs/allowProxy.php">
          can be found in the code repository
        </a>
        . If you want to be super safe, you should host Torii yourself and
        deploy your own allow-proxy.
      </p>
      <p>
        Optionally we allow for cross-device synchronozation of your Torii
        configuration. This will require your configuration to be stored on a
        server. You must explicitly enable this, since it is
        <strong> not</strong> enabled by default. Your configuration will be
        stored encrypted even then, so nobody will be able to spy on your
        configuration.
      </p>
    </div>
  );
}
