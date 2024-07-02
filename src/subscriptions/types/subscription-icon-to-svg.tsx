import { cn } from '@/ui/utils/cn.ts';
import {
  faBolt,
  faCar,
  faCarBurst,
  faCat,
  faCity,
  faDumbbell,
  faEye,
  faFaucetDrip,
  faFireFlameSimple,
  faHeart,
  faHouse,
  faKitMedical,
  faLandmark,
  faPeopleGroup,
  faPlaneArrival,
  faPlaneDeparture,
  faSackDollar,
  faTooth,
  faYinYang,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactElement } from 'react';
import GitHub from 'simple-icons/icons/github.svg?react';
import GoDaddy from 'simple-icons/icons/godaddy.svg?react';
import Google from 'simple-icons/icons/google.svg?react';
import HeadSpace from 'simple-icons/icons/headspace.svg?react';
import JetBrains from 'simple-icons/icons/jetbrains.svg?react';
import Netflix from 'simple-icons/icons/netflix.svg?react';
import ProtonMail from 'simple-icons/icons/protonmail.svg?react';
import Spotify from 'simple-icons/icons/spotify.svg?react';
import Telegram from 'simple-icons/icons/telegram.svg?react';
import YouTube from 'simple-icons/icons/youtube.svg?react';
import Moovit from '../assets/moovit.svg?react';
import type { SubscriptionIcon } from './subscription-icon.ts';

// must be in a separate file so the subscription-icon can be simple .ts file hence can be used in playwright
export const subscriptionIconToSvg = {
  telegram: <Telegram className={cn(`fill-[#26A5E4]`)} />,
  netflix: <Netflix className={cn(`fill-[#E50914]`)} />,
  jetbrains: <JetBrains className={cn(`fill-[#000000]`)} />,
  github: <GitHub className={cn(`fill-[#181717]`)} />,
  youtube: <YouTube className={cn(`fill-[#FF0000]`)} />,
  house: (
    <FontAwesomeIcon
      size="2xl"
      icon={faHouse}
      className={cn(`text-slate-800`)}
    />
  ),
  headspace: <HeadSpace className={cn(`fill-[#F47D31]`)} />,
  godaddy: <GoDaddy className={cn(`fill-[#1BDBDB]`)} />,
  moovit: <Moovit className={cn(`fill-[#FF6400]`)} />,
  tooth: (
    <FontAwesomeIcon
      size="2xl"
      icon={faTooth}
      className={cn(`text-slate-800`)}
    />
  ),
  car: (
    <FontAwesomeIcon
      size="2xl"
      icon={faCar}
      className={cn(`text-slate-800`)}
    />
  ),
  eye: (
    <FontAwesomeIcon
      size="2xl"
      icon={faEye}
      className={cn(`text-slate-800`)}
    />
  ),
  heart: (
    <FontAwesomeIcon
      size="2xl"
      icon={faHeart}
      className={cn(`text-slate-800`)}
    />
  ),
  city: (
    <FontAwesomeIcon
      size="2xl"
      icon={faCity}
      className={cn(`text-slate-800`)}
    />
  ),
  'plane-departure': (
    <FontAwesomeIcon
      size="2xl"
      icon={faPlaneDeparture}
      className={cn(`text-slate-800`)}
    />
  ),
  'plane-arrival': (
    <FontAwesomeIcon
      size="2xl"
      icon={faPlaneArrival}
      className={cn(`text-slate-800`)}
    />
  ),
  'car-burst': (
    <FontAwesomeIcon
      size="2xl"
      icon={faCarBurst}
      className={cn(`text-slate-800`)}
    />
  ),
  dumbbell: (
    <FontAwesomeIcon
      size="2xl"
      icon={faDumbbell}
      className={cn(`text-slate-800`)}
    />
  ),
  bolt: (
    <FontAwesomeIcon
      size="2xl"
      icon={faBolt}
      className={cn(`text-slate-800`)}
    />
  ),
  'people-group': (
    <FontAwesomeIcon
      size="2xl"
      icon={faPeopleGroup}
      className={cn(`text-slate-800`)}
    />
  ),
  'sack-dollar': (
    <FontAwesomeIcon
      size="2xl"
      icon={faSackDollar}
      className={cn(`text-slate-800`)}
    />
  ),
  'yin-yang': (
    <FontAwesomeIcon
      size="2xl"
      icon={faYinYang}
      className={cn(`text-slate-800`)}
    />
  ),
  cat: (
    <FontAwesomeIcon
      size="2xl"
      icon={faCat}
      className={cn(`text-slate-800`)}
    />
  ),
  'kit-medical': (
    <FontAwesomeIcon
      size="2xl"
      icon={faKitMedical}
      className={cn(`text-slate-800`)}
    />
  ),
  'proton-mail': <ProtonMail className={cn(`fill-[#6D4AFF]`)} />,
  google: <Google className={cn(`fill-[#4285F4]`)} />,
  spotify: <Spotify className={cn(`fill-[#1DB954]`)} />,
  landmark: (
    <FontAwesomeIcon
      size="2xl"
      icon={faLandmark}
      className={cn(`text-slate-800`)}
    />
  ),
  'faucet-drip': (
    <FontAwesomeIcon
      size="2xl"
      icon={faFaucetDrip}
      className={cn(`text-slate-800`)}
    />
  ),
  'fire-flame-simple': (
    <FontAwesomeIcon
      size="2xl"
      icon={faFireFlameSimple}
      className={cn(`text-slate-800`)}
    />
  ),
} as const satisfies Record<SubscriptionIcon, ReactElement>;
