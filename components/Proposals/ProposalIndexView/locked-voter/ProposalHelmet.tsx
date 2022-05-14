import { Helmet } from "react-helmet";

import { useCardinalName } from "../../../../../../hooks/cardinal/useAddressName";
import { useGovernor } from "../../../../../../hooks/tribeca/useGovernor";
import type { ProposalInfo } from "../../../../../../hooks/tribeca/useProposals";
import { tsToDate } from "../../../../../../utils/utils";

interface Props {
  proposalInfo: ProposalInfo;
}

export const ProposalHelmet: React.FC<Props> = ({ proposalInfo }: Props) => {
  const { daoName } = useGovernor();
  const { index } = proposalInfo;

  const cardinalName = useCardinalName(proposalInfo.proposalData.proposer);
  const author = cardinalName ?? proposalInfo.proposalData.proposer.toString();
  const twitterName = cardinalName?.startsWith("@") ? cardinalName : null;

  const title = proposalInfo?.proposalMetaData
    ? `${daoName ?? "Governance"} Proposal #${index}: ${
        proposalInfo.proposalMetaData.title
      }`
    : `${daoName ?? "Governance"} Proposal #${index}`;

  const description = proposalInfo.proposalMetaData
    ? proposalInfo.proposalMetaData.descriptionLink.slice(0, 200)
    : null;

  return (
    <Helmet>
      <title>
        {title} | {daoName}
      </title>

      {description && <meta name="description" content={description} />}
      {description && <meta name="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}

      <meta name="og:title" content={title} />
      <meta name="og:type" content="article" />
      <meta
        name="og:article:published_time"
        content={tsToDate(proposalInfo.proposalData.createdAt).toISOString()}
      />
      {author && <meta name="og:article:author" content={author} />}

      <meta name="twitter:title" content={title} />
      {twitterName && <meta name="twitter:creator" content={twitterName} />}
    </Helmet>
  );
};
