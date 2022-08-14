export default async function resolveAllPromises(object) {
  if (object && typeof object.then == "function") {
    object = await object;
  }
  if (!object || typeof object != "object") {
    return object;
  }

  const toBeResolved = [];
  Object.keys(object).forEach((key) => {
    if (object[key] && typeof object[key].then == "function") {
      toBeResolved.push(object[key].then((res) => (object[key] = res)));
    }

    if (object[key] && typeof object[key] == "object") {
      toBeResolved.push(resolveAllPromises(object[key]));
    }
  });

  await Promise.allSettled(toBeResolved);
  return object;
}
