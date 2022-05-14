import { useWalletIdentity } from '@cardinal/namespaces-components';
import { useConnectedWallet, useSolana } from '@saberhq/use-solana';
import type { PublicKey } from '@solana/web3.js';
import makeBlockie from 'ethereum-blockies-base64';
import { FaExclamationTriangle, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useAddressImage } from '../../../hooks/cardinal/useAddressImage';
import { useCardinalDisplayName } from '../../../hooks/cardinal/useAddressName';
import { AddressLink } from '../AddressLink';
import { ContentLoader } from '../ContentLoader';
import { MouseoverTooltip } from '../MouseoverTooltip';

interface Props {
  address: PublicKey;
  href?: string;
}

export const Profile: React.FC<Props> = ({ address, href }: Props) => {
  const { network, connection } = useSolana();
  const wallet = useConnectedWallet();
  const { name, displayName } = useCardinalDisplayName(address);
  const { addressImage, loadingImage } = useAddressImage(address);
  const { show } = useWalletIdentity();
  const image = (
    <img
      tw="h-10 w-10 rounded-full"
      alt={`Profile of ${displayName ?? address.toString()}`}
      src={addressImage ?? makeBlockie(address.toString())}
    />
  );
  return (
    <div tw="text-sm">
      <div tw="flex gap-2 items-center">
        <div tw="h-10 w-10 rounded-full flex">
          {loadingImage ? (
            <ContentLoader tw="h-10 w-10 rounded-full" />
          ) : href ? (
            <Link to={href}>{image}</Link>
          ) : (
            image
          )}
        </div>
        <div tw="flex flex-col leading-normal">
          <div tw="flex gap-1 items-center">
            <div tw="h-5 flex items-center">
              {displayName === undefined ? (
                <ContentLoader tw="h-4 w-12 rounded" />
              ) : (
                <span
                  css={[
                    name ? tw`text-white` : tw`text-warmGray-400`,
                    tw`font-medium`
                  ]}
                >
                  {displayName}
                </span>
              )}
            </div>
            {name?.startsWith('@') && (
              <a
                href={`https://twitter.com/${name.slice(1)}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaTwitter
                  css={css`
                    color: #1da1f2;
                  `}
                />
              </a>
            )}
            {name === null && wallet && wallet.publicKey.equals(address) && (
              <MouseoverTooltip text="Your profile is not verified. Please link your Twitter.">
                <button onClick={() => show(wallet, connection, network)}>
                  <FaExclamationTriangle tw="text-yellow-500" />
                </button>
              </MouseoverTooltip>
            )}
          </div>
          <AddressLink tw="text-gray-400" address={address} showCopy />
        </div>
      </div>
    </div>
  );
};
