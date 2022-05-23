import { useProgramLabel } from 'hooks/useProgramMeta';
import { SYSVAR_OWNER } from 'helpers/utils';
import { AddressLink } from '../../AddressLink';

type Props = React.ComponentProps<typeof AddressLink>;

/**
 * Renders a program label.
 * @returns
 */
export const ProgramLabel: React.FC<Props> = ({ address, ...rest }: Props) => {
  const label = useProgramLabel(address);
  if (address.equals(SYSVAR_OWNER)) {
    return <>SYSVAR</>;
  }
  return (
    <AddressLink
      // tw="dark:text-primary hover:text-opacity-80"
      address={address}
      {...rest}
    >
      {label}
    </AddressLink>
  );
};
