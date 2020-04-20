import { useEventListener } from './useEventListener';

export const useConfirmLeave = () => {
  useEventListener(window, 'beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
  });
};
