export default function overrides() {
  // Array additions
  Array.prototype.remove = function remove<T>(forDeletion: T | T[]) {
    if (Array.isArray(forDeletion)) {
      return this.filter((item) => !forDeletion.includes(item))
    } else {
      return this.filter((item) => item !== forDeletion)
    }
  }
}
