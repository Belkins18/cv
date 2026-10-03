// Этот файл обязан не компилироваться: он нарушает noUncheckedIndexedAccess
// и exactOptionalPropertyTypes. Если tsc его принял — пресет недостаточно строг.
const items: string[] = []
const first: string = items[0]
// Присваивание даёт TS2322 («not assignable»), а чтение — TS18048
// («possibly 'undefined'»). Нужны оба: именно второе ловит реальный падающий
// рантайм, когда индекса в массиве нет.
const shouted: string = items[0].toUpperCase()

type User = { name?: string }
const user: User = { name: undefined }

export { first, shouted, user }
