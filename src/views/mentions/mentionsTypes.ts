import type { ExtractPropTypes, HTMLAttributes, InjectionKey, PropType, VNode, Ref } from 'vue'
export type VNodeChildAtom = VNode | string | number | boolean | null | undefined | void
export type VueNode = VNodeChildAtom | VNodeChildAtom[] | JSX.Element
export function anyType<T = any> (defaultVal?: T, required?: boolean) {
  const type = { validator: () => true, default: defaultVal as T } as unknown
  return required
    ? (type as {
        type: PropType<T>
        default: T
        required: true
      })
    : (type as {
        default: T
        type: PropType<T>
      })
}

export function arrayType<T extends any[]> (defaultVal?: T) {
  return { type: Array as unknown as PropType<T>, default: defaultVal as T }
}

export function objectType<T = {}> (defaultVal?: T) {
  return { type: Object as PropType<T>, default: defaultVal as T }
}

export const baseOptionsProps = {
  value: String,
  disabled: Boolean,
  payload: objectType<Record<string, any>>()
}

type BaseOptionsProps = Partial<ExtractPropTypes<typeof baseOptionsProps>> & Partial<HTMLAttributes>
const optionProps = {
  ...baseOptionsProps,
  label: anyType<VueNode |((o: BaseOptionsProps) => VueNode)>([])
}

export type OptionProps = Partial<ExtractPropTypes<typeof optionProps>> & Partial<HTMLAttributes>
export type EventHandler = (...args: any[]) => void

export interface MentionsContext {
  activeIndex: Ref<number>
  setActiveIndex?: (index: number) => void
  selectOption?: (option: OptionProps) => void
  onFocus?: EventListener
  onBlur?: EventListener
  loading?: Ref<boolean>
}

export const MentionsContextKey: InjectionKey<MentionsContext> = Symbol('MentionsContextKey')
