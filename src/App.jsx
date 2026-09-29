import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminEditor from './pages/AdminEditor.jsx'
import AiGuide from './pages/AiGuide.jsx'
import Anime from './pages/Anime.jsx'
import ApiDocs from './pages/ApiDocs.jsx'
import ApiProtocol from './pages/ApiProtocol.jsx'
import ArchivistCredentials from './pages/ArchivistCredentials.jsx'
import AudioDispatch from './pages/AudioDispatch.jsx'
import BetaLaunchHorizon from './pages/BetaLaunchHorizon.jsx'
import Bookmarks from './pages/Bookmarks.jsx'
import CategoryBrowse from './pages/CategoryBrowse.jsx'
import CharacterArchive from './pages/CharacterArchive.jsx'
import ComicsManga from './pages/ComicsManga.jsx'
import CommunityGuidelines from './pages/CommunityGuidelines.jsx'
import ContentModeration from './pages/ContentModeration.jsx'
import ConventionsTracker from './pages/ConventionsTracker.jsx'
import Cosplay from './pages/Cosplay.jsx'
import CosplayCompetitions from './pages/CosplayCompetitions.jsx'
import CreatorLicensing from './pages/CreatorLicensing.jsx'
import CustomCollections from './pages/CustomCollections.jsx'
import Details from './pages/Details.jsx'
import EventsCalendar from './pages/EventsCalendar.jsx'
import Explore from './pages/Explore.jsx'
import FanSubmission from './pages/FanSubmission.jsx'
import Feedback from './pages/Feedback.jsx'
import FollowedFandoms from './pages/FollowedFandoms.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Gaming from './pages/Gaming.jsx'
import Home from './pages/Home.jsx'
import KPop from './pages/KPop.jsx'
import LatestArchives from './pages/LatestArchives.jsx'
import Login from './pages/Login.jsx'
import MerchShowcase from './pages/MerchShowcase.jsx'
import MetadataTaxonomies from './pages/MetadataTaxonomies.jsx'
import MoviesTV from './pages/MoviesTV.jsx'
import MultimediaCenter from './pages/MultimediaCenter.jsx'
import NotFound from './pages/NotFound.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import RatingsIndex from './pages/RatingsIndex.jsx'
import Register from './pages/Register.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import SearchPage from './pages/SearchPage.jsx'
import SecurityAuditLogs from './pages/SecurityAuditLogs.jsx'
import SoundtrackVault from './pages/SoundtrackVault.jsx'
import SpotlightDossiers from './pages/SpotlightDossiers.jsx'
import Theater from './pages/Theater.jsx'
import TheatricalPremieres from './pages/TheatricalPremieres.jsx'
import Trending from './pages/Trending.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import VisualGalleries from './pages/VisualGalleries.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />

      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile/:name" element={<Profile />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/saved-bookmarks" element={<Bookmarks />} />
        <Route path="/followed-fandoms" element={<FollowedFandoms />} />
        <Route path="/custom-collections" element={<CustomCollections />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/fan-submission" element={<FanSubmission />} />

     
        <Route path="/anime" element={<Anime />} />
        <Route path="/gaming" element={<Gaming />} />
        <Route path="/movies-and-tv" element={<MoviesTV />} />
        <Route path="/movies-tv" element={<MoviesTV />} />
        <Route path="/k-pop" element={<KPop />} />
        <Route path="/comics-and-manga" element={<ComicsManga />} />
        <Route path="/comics-manga" element={<ComicsManga />} />
        <Route path="/cosplay" element={<Cosplay />} />
        <Route path="/category-browse" element={<CategoryBrowse />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/latest-archives" element={<LatestArchives />} />

        <Route path="/multimedia-center" element={<MultimediaCenter />} />
        <Route path="/theater" element={<Theater />} />
        <Route path="/audio-dispatch" element={<AudioDispatch />} />
        <Route path="/soundtrack-vault" element={<SoundtrackVault />} />
        <Route path="/visual-galleries" element={<VisualGalleries />} />
        <Route path="/4k-visual-galleries" element={<VisualGalleries />} />
        <Route path="/ratings-index" element={<RatingsIndex />} />
        <Route path="/user-ratings-index" element={<RatingsIndex />} />

        <Route path="/character-archive" element={<CharacterArchive />} />
        <Route path="/character-archive/:name" element={<CharacterArchive />} />
        <Route path="/spotlight-dossiers" element={<SpotlightDossiers />} />
        <Route path="/merch-showcase" element={<MerchShowcase />} />
        <Route path="/events-calendar" element={<EventsCalendar />} />
        <Route path="/calendar-2025" element={<EventsCalendar />} />
        <Route path="/conventions-tracker" element={<ConventionsTracker />} />
        <Route path="/theatrical-premieres" element={<TheatricalPremieres />} />
        <Route path="/beta-launch-horizon" element={<BetaLaunchHorizon />} />
        <Route path="/cosplay-competitions" element={<CosplayCompetitions />} />

        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/archivist-credentials" element={<ArchivistCredentials />} />
        <Route path="/ai-guide" element={<AiGuide />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-panel" element={<AdminDashboard />} />
        <Route path="/admin-cms" element={<AdminDashboard />} />
        <Route path="/admin/editor" element={<AdminEditor />} />
        <Route path="/content-moderation" element={<ContentModeration />} />
        <Route path="/metadata-taxonomies" element={<MetadataTaxonomies />} />
        <Route path="/api-docs" element={<ApiDocs />} />
        <Route path="/security-audit-logs" element={<SecurityAuditLogs />} />
        <Route path="/api-protocol" element={<ApiProtocol />} />
        <Route path="/creator-licensing" element={<CreatorLicensing />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
