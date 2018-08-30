import { interfaceName, resolveReference } from './utils'
import { isRecordType, isPrimitive, isEnumType, isArrayType, isMapType } from '../model'
import { GeneratorContext } from './typings'

function generatePrimitive(avroType: string): string {
  switch (avroType) {
    case 'long':
    case 'int':
    case 'double':
    case 'float':
      return 'number'
    case 'bytes':
      return 'Buffer'
    case 'null':
      return 'null'
    case 'boolean':
      return 'boolean'
    case 'string':
      return 'string'
    default:
      throw new TypeError(`Unknown primitive type: ${avroType}`)
  }
}

export function generateFieldType(type: any, context: GeneratorContext): string {
  if (isPrimitive(type)) {
    return generatePrimitive(type)
  } else if (typeof type === 'string') {
    return generateFieldType(resolveReference(type, context), context)
  } else if (type instanceof Array) {
    return type.map((tpe) => generateFieldType(tpe, context)).join(' | ')
  } else if (isRecordType(type)) {
    return interfaceName(type)
  } else if (isEnumType(type)) {
    return type.name
  } else if (isArrayType(type)) {
    if ([].concat(type.items).length === 1) {
      return `${generateFieldType(type.items, context)}[]`
    }
    return `(${generateFieldType(type.items, context)})[]`
  } else if (isMapType(type)) {
    return `{ [index:string]:${generateFieldType(type.values, context)} }`
  }
  throw new TypeError(`Unknown type ${type}!`)
}
