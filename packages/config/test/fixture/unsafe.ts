// This file is required not to compile: it violates noUncheckedIndexedAccess
// and exactOptionalPropertyTypes. If tsc accepts it, the preset is not strict
// enough.
const items: string[] = []
const first: string = items[0]
// The assignment yields TS2322 ("not assignable"), the read yields TS18048
// ("possibly 'undefined'"). Both are needed: it is the second one that catches
// the runtime that actually throws when the index is not in the array.
const shouted: string = items[0].toUpperCase()

type User = { name?: string }
const user: User = { name: undefined }

export { first, shouted, user }
