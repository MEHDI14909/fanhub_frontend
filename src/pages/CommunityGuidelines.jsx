import React from 'react';
import PageHeading from '../components/PageHeading.jsx';

export default function CommunityGuidelines() {
  return (
    <>
      <PageHeading
        title="Community Guidelines"
        description="Simple rules for a respectful FanHub Plus community."
      />

      <div className="panel rules">
        <h2>Community Rules</h2>
        <p>Be respectful to other fans and creators.</p>
        <p>Do not post spam, harassment or harmful content.</p>
        <p>
          Keep discussions relevant to fandom, entertainment and community
          topics.
        </p>
        <p>Report content that breaks the community rules.</p>
      </div>
    </>
  );
}
