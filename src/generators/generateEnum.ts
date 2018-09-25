import { EnumType, EnumVariant } from '../model'
import { GeneratorContext } from './typings'
import { enumName } from './utils'

function generateEnum(type: EnumType): string {
  return `export enum ${enumName(type)} {
    ${type.symbols.map((symbol) => `${symbol} = '${symbol}'`).join(',\n')}
  }`
}

function generateConstEnum(type: EnumType): string {
  return `export const enum ${enumName(type)} {
    ${type.symbols.map((symbol) => `${symbol} = '${symbol}'`).join(',\n')}
  }`
}

function generateStringUnion(type: EnumType): string {
  return `export type ${enumName(type)} = ${type.symbols.map((symbol) => `'${symbol}'`).join(' | ')}`
}

export function generateEnumType(type: EnumType, context: GeneratorContext): string {
  switch (context.options.enums) {
    case EnumVariant.ENUM:
      return generateEnum(type)
    case EnumVariant.CONST_ENUM:
      return generateConstEnum(type)
    case EnumVariant.STRING:
      return generateStringUnion(type)
  }
}
