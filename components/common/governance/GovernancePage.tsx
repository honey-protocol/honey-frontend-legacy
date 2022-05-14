import {
  useGovernor
  // useGovernorInfo,
} from 'hooks/tribeca/useGovernor';
// import { GovernanceNotFoundPage } from '../../pages/governance/GovernanceNotFoundPage';
// import { LoadingPage } from '../LoadingPage';
import { GovernancePageInner } from './GovernancePageInner';

interface Props {
  title: React.ReactNode;
  header?: React.ReactNode;
  right?: React.ReactNode;
  preContent?: React.ReactNode;
  children?: React.ReactNode;
  contentStyles?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  hideDAOName?: boolean;
  backLink?: {
    label: string;
    href: string;
  };
}

export const GovernancePage: React.FC<Props> = ({ ...props }: Props) => {
  // const info = useGovernorInfo();
  const { governorData } = useGovernor();
  if (governorData === null) {
    return <div>Not found</div>;
    // return <GovernanceNotFoundPage />;
  }
  // if (info?.loading) {
  //   return <LoadingPage />;
  // }
  return <GovernancePageInner {...props} />;
};
