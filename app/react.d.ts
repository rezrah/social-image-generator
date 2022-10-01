import "react";

declare module "react" {
  /**
   * Temporary override for Primer/react to typecheck properly, since it uses `React.FC` internally
   */

  export interface FunctionComponent<P = {}> {
    (props: React.PropsWithChildren<P>, context?: any): ReactElement<
      any,
      any
    > | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }
}
