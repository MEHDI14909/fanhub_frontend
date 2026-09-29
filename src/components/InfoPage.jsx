import React from 'react'
import { ArrowRight, Database, Radio, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeading from './PageHeading.jsx'

export default function InfoPage({
  title,
  description,
  children,
  link = '/explore',
  linkText = 'Back to Explore'
}) {
  return (
    <>
      <PageHeading title={title} description={description} />

      <section className="info-hero panel">
        <div className="info-copy">
          <span className="tag">LIVE ARCHIVE NODE</span>
          <h2>{title}</h2>

          {children || <p>{description}</p>}

          <div className="actions">
            <Link className="primary" to={link}>
              {linkText} <ArrowRight size={17} />
            </Link>
            <Link className="ghost" to="/search">
              Search archive
            </Link>
          </div>
        </div>

        <div className="info-metrics">
          <div>
            <Database size={19} />
            <b>MongoDB</b>
            <span>Database</span>
          </div>
          <div>
            <Radio size={19} />
            <b>REST</b>
            <span>API connection</span>
          </div>
          <div>
            <Sparkles size={19} />
            <b>MERN</b>
            <span>Project stack</span>
          </div>
        </div>
      </section>
    </>
  )
}
