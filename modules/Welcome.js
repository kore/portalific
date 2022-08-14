import { Fragment } from "react";

export default function Welcome() {
  return (
    <div className="text-base prose mx-auto">
      <h1>
        <span className="block text-lg text-center text-primary-600 font-semibold">
          Offline-first, privacy-focussed, open-source personal portal
        </span>
        <span className="mt-2 block text-3xl text-center leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl sm:tracking-tight">
          Torii
        </span>
      </h1>
      <p className="mt-8 text-xl text-gray-500 leading-8">
        Torii is an OpenSource browser based portal, displaying your feeds,
        your calendars, and other information of personal relevance. It works
        (almost) entirely browser-based, so you data is safe and secure. For
        cross-device synchronization you can optionally use a backend to
        synchronize the data continuously between devices.
      </p>
      <h2>From beginner to expert in 30 days</h2>
      <p>
        Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
        Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus
        mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam turpis
        ipsum eu a sed convallis diam.
      </p>
      <ul role="list">
        <li>Quis elit egestas venenatis mattis dignissim.</li>
        <li>Cras cras lobortis vitae vivamus ultricies facilisis tempus.</li>
        <li>Orci in sit morbi dignissim metus diam arcu pretium.</li>
      </ul>
      <p>
        Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
        Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed tellus
        mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam turpis
        ipsum eu a sed convallis diam.
      </p>
      <blockquote>
        <p>
          Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque tristique
          pellentesque. Blandit amet, sed aenean erat arcu morbi.
        </p>
      </blockquote>
    </div>
  );
}
