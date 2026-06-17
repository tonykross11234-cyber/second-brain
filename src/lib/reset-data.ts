import { useEntriesStore } from '../store/useEntriesStore'
import { useTasksStore } from '../store/useTasksStore'
import { useProfileStore } from '../store/useProfileStore'
import { useChatStore } from '../store/useChatStore'
import { useFitnessStore } from '../store/useFitnessStore'

export function resetAllData(): void {
  useEntriesStore.setState({ entries: [] })
  useTasksStore.setState({ tasks: [] })
  useChatStore.setState({ messages: [], motivation: null })
  useFitnessStore.getState().reset()
  useProfileStore.setState({
    name: '',
    weightKg: null,
    heightCm: null,
    age: null,
    pinEnabled: false,
    pinCode: null,
    pinSetupOffered: false,
  })
}
