import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';
import { createContext, useContext } from 'react';

export interface ToolbarAction {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  className?: string,
  isVisible?: boolean;
}

interface ToolbarContextInitialStateDto {
  actions: Array<ToolbarAction>;
  setActions: React.Dispatch<React.SetStateAction<Array<ToolbarAction>>>;
}

export const ToolbarContext = createContext<ToolbarContextInitialStateDto>({
  actions: [],
  setActions: () => {},
});

export const useToolbarContext = (): ToolbarContextInitialStateDto => {
  const toolbarContext = useContext(ToolbarContext);
  if (!toolbarContext) {
    throw new Error('useToolbarContext must be used within the useToolbarContext.Provider');
  }
  return toolbarContext;
};
