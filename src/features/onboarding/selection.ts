export type SelectionState = Set<string>

export type SelectionAction =
  | { type: 'toggle'; itemId: string }
  | { type: 'set'; ids: string[] }
  | { type: 'reset' }

export function selectionReducer(
  state: SelectionState,
  action: SelectionAction,
): SelectionState {
  switch (action.type) {
    case 'toggle': {
      const next = new Set(state)
      if (next.has(action.itemId)) next.delete(action.itemId)
      else next.add(action.itemId)
      return next
    }
    case 'set':
      return new Set(action.ids)
    case 'reset':
      return new Set()
  }
}
