export function countInstances (str, instance) {
  return (str.match(new RegExp(instance, 'g')) || []).length;
}