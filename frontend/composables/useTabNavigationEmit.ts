type EmitType = (event: 'tab', payload?: string) => void;

export default function useTabNavigationEmit(emit: EmitType) {
  const onTabPress = (isLastItem: boolean, event: KeyboardEvent) => {
    console.log('tab')
    if ((!isLastItem && event.shiftKey && event.key === 'Tab') || (isLastItem && !event.shiftKey && event.key === 'Tab')) {
      event.preventDefault()
      emit('tab')
    }
  }
  return { onTabPress }
}
