import { RecordType, isPrimitive, isArrayType, isMapType, isEnumType, isRecordType, HasName, EnumType } from '../model'
import { GeneratorContext } from './typings'

export function alphaComparator(a: HasName, b: HasName) {
  if (a.name < b.name) {
    return -1
  } else if (a.name > b.name) {
    return 1
  }
  return 0
}

export function interfaceName(type: RecordType) {
  return `I${type.name}`
}

export function className(type: RecordType) {
  return type.name
}

export function enumName(type: EnumType) {
  return type.name
}

function qualifiedNameFor<T extends HasName>(type: T, transform: (T) => string, context: GeneratorContext) {
  const baseName = transform(type)
  if (context.options.removeNameSpace) {
    return baseName
  }
  return type.namespace ? `${type.namespace}.${baseName}` : `${baseName}`
}

export function qInterfaceName(type: RecordType, context: GeneratorContext) {
  return qualifiedNameFor(type, interfaceName, context)
}

export function qClassName(type: RecordType, context: GeneratorContext) {
  return qualifiedNameFor(type, className, context)
}

export function qEnumName(type: EnumType, context: GeneratorContext) {
  return qualifiedNameFor(type, enumName, context)
}

export function qualifiedName(type: HasName) {
  return type.namespace ? `${type.namespace}.${type.name}` : type.name
}

export function resolveReference(ref: string, context: GeneratorContext): HasName {
  const fqn = context.fqnResolver.get(ref)
  return context.nameToTypeMapping.get(fqn)
}

export function asSelfExecuting(code: string): string {
  return `(() => {
    ${code}
  })()`
}

export function joinConditional(branches: [string, string][]): string {
  if (branches.length === 0) {
    return ''
  }
  const [[firstCond, firstBranch], ...restOfBranches] = branches
  return `if(${firstCond}){\n${firstBranch}\n}
  ${restOfBranches.map(([cond, branch]) => `else if(${cond}){\n${branch}\n}`).join('\n')}`
}

export function getTypeName(type: any, context: GeneratorContext): string {
  if (isPrimitive(type)) {
    return type
  } else if (isArrayType(type) || isMapType(type)) {
    return type.type
  } else if (isRecordType(type) || isEnumType(type)) {
    return qualifiedName(type)
  } else if (typeof type === 'string') {
    return context.fqnResolver.get(type)
  }
}

export function groupByNamespace<T extends HasName>(types: T[]): Map<string, T[]> {
  const mapping = new Map<string, T[]>()
  types.forEach((type) => {
    if (!Array.isArray(mapping.get(type.namespace))) {
      mapping.set(type.namespace, [])
    }
    const array = mapping.get(type.namespace)
    array.push(type)
  })
  return mapping
}

export function collectNamespaces(types: HasName[]): Set<string> {
  const ns = new Set<string>()
  types.forEach(({ namespace }) => ns.add(namespace))
  return ns
}
