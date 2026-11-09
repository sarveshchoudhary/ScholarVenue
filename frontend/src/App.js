import { useEffect, useRef, useState } from "react";
import axios from "axios";
import VenueRecommenderEnhanced from "./components/VenueRecommenderEnhanced";
import "./index.css";

const formatNumber = (value) => Number(value || 0).toLocaleString();
const formatFileSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

function ScholarVenueLogo() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 52 52" role="img">
        <path className="logo-cap" d="M4 13 26 3l22 10-22 10L4 13Z" />
        <path className="logo-cap-base" d="M10 15v9c8 5 24 5 32 0v-9l-16 7L10 15Z" />
        <path className="logo-tassel" d="M44 14v10" />
        <circle className="logo-tassel-dot" cx="44" cy="26" r="2" />
        <path className="logo-bulb" d="M26 17c-8 0-14 6-14 14 0 5 3 8 5 11 1 2 1 4 1 5h16c0-2 0-4 1-6 3-3 5-6 5-10 0-8-6-14-14-14Z" />
        <path className="logo-bulb-heart" d="M26 27c-2-5-9-4-9 1 0 5 7 9 9 11 2-2 9-6 9-11 0-5-7-6-9-1Z" />
        <path className="logo-bulb-base" d="M18 47h16m-14 3h12" />
      </svg>
    </span>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [legalPanel, setLegalPanel] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please choose a PDF research paper.");
      return;
    }
    setError("");
    setFile(selectedFile);
  };

  useEffect(() => {
    if (!loading) {
      setLoadingStage(0);
      return undefined;
    }
    const timer = window.setInterval(() => {
      setLoadingStage((stage) => Math.min(stage + 1, 3));
    }, 1700);
    return () => window.clearInterval(timer);
  }, [loading]);

  const analyze = async () => {
    if (!file) {
      setError("Choose a PDF paper before starting the analysis.");
      return;
    }
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post("/analyze", formData, {
        onUploadProgress: (event) => {
          if (event.total) setLoadingStage(event.loaded / event.total < 1 ? 0 : 1);
        },
      });
      setData(response.data);
      setActiveTab("overview");
    } catch (requestError) {
      console.error(requestError);
      setError("We could not analyze that paper. Check that the API is running and try again.");
    } finally {
      setLoading(false);
    }
  };

  const score = Number(data?.score || 0);
  const domain = data?.domain_stats?.domain || "Your research area";
  const scoreLabel = score > 8 ? "Publication ready" : score > 5 ? "Strong foundation" : "Needs refinement";
  const scoreTone = score > 8 ? "mint" : score > 5 ? "amber" : "rose";
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "summary", label: "Paper summary" },
    { id: "recommendations", label: "Improvements" },
    { id: "venues", label: "Find venues" },
  ];
  const loadingStages = ["Uploading paper", "Extracting research", "Evaluating quality", "Finding venue matches"];
  const scorePercent = Math.max(0, Math.min(score * 10, 100));
  const legalContent = {
    privacy: {
      title: "Privacy policy",
      body: "Your uploaded paper is used to generate this analysis and venue recommendation. ScholarVenue does not present itself as a permanent document archive. Avoid uploading confidential, unpublished, or personally identifying material unless you have permission to do so."
    },
    terms: {
      title: "Terms of service",
      body: "ScholarVenue provides research guidance and reference information. Results are suggestions, not guarantees of acceptance, indexing status, review time, publication cost, or academic credit. You are responsible for checking the official publisher, index, and institutional requirements before submission."
    },
    contact: {
      title: "Contact",
      body: "For questions, feedback, or reporting inaccurate venue information, please contact the ScholarVenue project team through your project administrator or institutional support channel."
    },
    sitemap: {
      title: "Sitemap",
      body: "Home · How it works · Publication playbook · Research report · Paper summary · Improvements · Find venues · About ScholarVenue"
    }
  };

  return (
    <div className="app-shell">
      <header className="site-nav">
        <a className="brand" href="#top" aria-label="ScholarVenue home">
          <ScholarVenueLogo />
          <span>
            <strong>ScholarVenue</strong>
            <small>RESEARCH INTELLIGENCE</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#insights">Insights</a>
          <a href="#about">About</a>
        </nav>
        <button className="nav-cta" onClick={() => inputRef.current?.click()}>
          Analyze a paper <span>↗</span>
        </button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
          <div className="hero-copy">
            <p className="eyebrow"><span /> Research, with direction</p>
            <h1>Find where your<br /><em>ideas belong.</em></h1>
            <p className="hero-description">
              ScholarVenue turns your research paper into a clear quality profile,
              meaningful insights, and a shortlist of venues made for your work.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => inputRef.current?.click()}>
                Start with your paper <span>→</span>
              </button>
              <a className="text-link" href="#how-it-works">Explore the process <span>↓</span></a>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack"><span>R</span><span>M</span><span>A</span><span>+</span></div>
              <p><strong>Built for researchers</strong><br />Make your next submission a confident one.</p>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-glow" />
            <div className="paper-preview">
              <div className="preview-top"><span className="preview-dot" /><span>ScholarVenue analysis</span><b>•••</b></div>
              <div className="preview-body">
                <div className="preview-kicker">PAPER PROFILE / 01</div>
                <h3>Neural networks for<br />human-centered discovery</h3>
                <div className="preview-line long" /><div className="preview-line" />
                <div className="preview-score"><strong>8.6</strong><span>/10<br /><small>quality score</small></span></div>
                <div className="preview-tags"><span>Computer Science</span><span>92% confidence</span></div>
              </div>
            </div>
            <div className="floating-note note-top"><span>✦</span> Smart venue matching</div>
            <div className="floating-note note-bottom"><span>↗</span> 48,151 venues indexed</div>
          </div>
        </section>

        <section className="upload-section" id="how-it-works">
          <div className="section-heading">
            <p className="eyebrow dark"><span /> Begin your review</p>
            <h2>One paper. A clearer<br /><em>path forward.</em></h2>
            <p>Upload your PDF and let our research intelligence do the heavy lifting.</p>
          </div>
          <div className="upload-card">
            <div
              className={`drop-zone ${file ? "has-file" : ""}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files[0]); }}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => (event.key === "Enter" || event.key === " ") && inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={(event) => handleFile(event.target.files[0])} />
              <div className="upload-icon">{file ? "✓" : "↑"}</div>
              <strong>{file ? file.name : "Drop your research paper here"}</strong>
              <span>{file ? `Ready to analyze · ${formatFileSize(file.size)}` : "or click to browse from your computer"}</span>
              <small>PDF files only · up to 25 MB</small>
            </div>
            <div className="upload-side">
              <p className="eyebrow dark"><span /> What you’ll receive</p>
              <ul>
                <li><span>01</span> A research quality score</li>
                <li><span>02</span> Domain and writing insights</li>
                <li><span>03</span> Personalized venue matches</li>
              </ul>
              {file && !loading && <button className="replace-file" onClick={() => { setFile(null); setError(""); inputRef.current?.click(); }}>Replace selected file</button>}
              <button className="primary-button full" onClick={analyze} disabled={loading}>
                {loading ? "Analyzing your paper..." : "Analyze my paper"} <span>→</span>
              </button>
              {loading && <div className="analysis-progress" aria-live="polite"><div className="progress-track"><span style={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }} /></div><div className="stage-list">{loadingStages.map((stage, index) => <span className={index <= loadingStage ? "complete" : ""} key={stage}><i>{index < loadingStage ? "✓" : index === loadingStage ? "•" : ""}</i>{stage}</span>)}</div></div>}
              {error && <p className="error-text">{error}</p>}
            </div>
          </div>
        </section>

        {!data && (
          <section className="stats-strip" id="insights">
            <div><strong>48k+</strong><span>venues in our database</span></div>
            <div><strong>10</strong><span>signals in every review</span></div>
            <div><strong>4 steps</strong><span>from upload to shortlist</span></div>
            <div><strong>100%</strong><span>built around your research</span></div>
          </section>
        )}

        {!data && (
          <section className="playbook-section" id="publishing-guide">
            <div className="section-heading playbook-heading">
              <p className="eyebrow dark"><span /> Before you submit</p>
              <h2>Choose a venue<br /><em>with confidence.</em></h2>
              <p>A strong match is more than a high score. Use this practical checklist alongside your ScholarVenue shortlist.</p>
            </div>
            <div className="playbook-grid">
              <article className="playbook-card playbook-main">
                <span className="card-label">THE PUBLICATION CHECKLIST</span>
                <div className="checklist">
                  <div><b>01</b><span><strong>Start with your requirements</strong>Check your university, department, funder, or thesis rules before trusting any venue list.</span></div>
                  <div><b>02</b><span><strong>Fit the scope first</strong>Read the aims and scope, then compare three recent papers with your topic, method, and depth.</span></div>
                  <div><b>03</b><span><strong>Verify the record</strong>Confirm the exact title or ISSN in the official Scopus Sources or Web of Science Master Journal List.</span></div>
                  <div><b>04</b><span><strong>Plan the trade-offs</strong>Compare review timeline, article charges, conference deadlines, presentation rules, and access options.</span></div>
                </div>
              </article>
              <article className="playbook-card route-card">
                <span className="card-label">JOURNAL OR CONFERENCE?</span>
                <div className="route-choice"><span>JOURNAL</span><strong>For depth &amp; lasting record</strong><p>Useful when your study needs a full method, detailed results, and a flexible submission window.</p></div>
                <div className="route-choice"><span>CONFERENCE</span><strong>For a fixed milestone</strong><p>Useful when you need a decision or presentation date, subject to your department’s rules.</p></div>
              </article>
            </div>
            <div className="guide-bottom">
              <div className="degree-guide"><span className="card-label">A SIMPLE STARTING POINT</span><div><b>B.Tech</b><span>Focused conference or suitable journal</span></div><div><b>M.Tech</b><span>Conference or indexed journal</span></div><div><b>PhD</b><span>Field-appropriate journal, often by quartile</span></div><small>These are patterns, not guarantees. Your institution’s regulation always decides.</small></div>
              <div className="red-flags"><span className="card-label">PAUSE BEFORE SUBMITTING</span><p><i>!</i> Guaranteed acceptance, unusually fast publication, unclear fees, copied websites, broad “everything” scopes, or indexing you cannot verify are warning signs.</p><a href="https://thinkchecksubmit.org/" target="_blank" rel="noreferrer">Use the Think. Check. Submit. checklist ↗</a></div>
            </div>
            <div className="source-note">Guidance adapted into original ScholarVenue content from <a href="https://www.phdproject.in/guides/where-to-publish-research-paper/" target="_blank" rel="noreferrer">Where to publish a research paper</a>, accessed November 2026. Always confirm current requirements with the official index and publisher.</div>
          </section>
        )}

        {data && (
          <section className="results-section" id="results">
            <div className="results-header">
              <div><p className="eyebrow dark"><span /> Your research report</p><h2>Insights that move<br /><em>your work forward.</em></h2></div>
            <div className="score-summary"><div className={`score-gauge ${scoreTone}`} style={{ "--score": `${scorePercent}%` }}><strong>{score.toFixed(1)}</strong><span>/10</span></div><div><span className="card-label">PUBLICATION READINESS</span><b>{scoreLabel}</b><small>Based on your paper profile</small></div></div>
            </div>
            <div className="result-tabs" role="tablist">
              {tabs.map((tab) => <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
            </div>
            {activeTab === "overview" && (
              <>
              <div className="insight-grid">
                <article className="insight-card featured"><span className="card-label">RESEARCH DOMAIN</span><h3>{domain}</h3><p>Your paper aligns with a focused research community.</p><div className="confidence"><span>Detection confidence</span><b>{Number(data.domain_stats?.confidence || 0).toFixed(0)}%</b></div><div className="progress"><span style={{ width: `${data.domain_stats?.confidence || 0}%` }} /></div></article>
                <article className="insight-card"><span className="card-label">VENUE LANDSCAPE</span><strong className="big-number">{formatNumber(data.domain_stats?.matching_venues)}</strong><p>relevant venues found for your domain</p><div className="mini-stats"><span><b>{formatNumber(data.domain_stats?.oa_count)}</b> open access</span><span><b>{formatNumber(data.domain_stats?.publishers_count)}</b> publishers</span></div></article>
                <article className="insight-card"><span className="card-label">PAPER SNAPSHOT</span><div className="snapshot-row"><span>Words</span><b>{formatNumber(data.features?.word_count)}</b></div><div className="snapshot-row"><span>Sentences</span><b>{formatNumber(data.features?.sentence_count)}</b></div><div className="snapshot-row"><span>Avg. word length</span><b>{Number(data.features?.avg_word_length || 0).toFixed(1)}</b></div></article>
                <article className="insight-card quote-card"><span className="quote-mark">“</span><p>{data.summary || "Your paper has been analyzed. Explore the tabs to understand its strengths and find the right publication path."}</p><span className="card-label">AI-GENERATED SUMMARY</span></article>
              </div>
              <div className="methodology-note"><span>✦</span><div><strong>How to read this report</strong><p>ScholarVenue combines paper structure, writing signals, research domain, and venue metadata. Results are decision support—not a guarantee of acceptance.</p></div><button onClick={() => setActiveTab("venues")}>Explore matches →</button></div>
              </>
            )}
            {activeTab === "summary" && <div className="simple-result"><span className="card-label">PAPER SUMMARY</span><p className="large-copy">{data.summary || "No summary was returned for this paper."}</p><div className="summary-meta"><span><b>{formatNumber(data.features?.word_count)}</b> words analyzed</span><span><b>{formatNumber(data.features?.sentence_count)}</b> sentences detected</span><span><b>{domain}</b> detected domain</span></div></div>}
            {activeTab === "recommendations" && <div className="simple-result"><span className="card-label">NEXT BEST ACTIONS</span>{(data.recommendations || []).length ? <div className="recommendation-list">{data.recommendations.map((item, index) => <div key={index}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{item.title}</strong>{item.description}</span></div>)}</div> : <div className="empty-result"><span>✓</span><strong>No urgent improvements detected</strong><p>Your paper profile looks consistent. Review the venue matches to choose your next step.</p></div>}</div>}
            {activeTab === "venues" && <VenueRecommenderEnhanced paperText={data.summary || ""} paperScore={score} paperTopic={domain} />}
          </section>
        )}
      </main>
      <footer id="about" className="site-footer">
        <div className="footer-main">
          <a className="brand" href="#top" aria-label="ScholarVenue home">
            <ScholarVenueLogo />
            <span><strong>ScholarVenue</strong><small>RESEARCH INTELLIGENCE</small></span>
          </a>
          <p>Research Paper Venue Recommender System</p>
          <span className="footer-tagline">Research smarter. Submit with intent.</span>
        </div>
        <div className="footer-legal">
          <span>© 2026 ScholarVenue. All rights reserved.</span>
          <nav aria-label="Legal navigation">
            <button type="button" onClick={() => setLegalPanel("privacy")}>Privacy policy</button>
            <button type="button" onClick={() => setLegalPanel("terms")}>Terms of service</button>
            <button type="button" onClick={() => setLegalPanel("contact")}>Contact</button>
            <button type="button" onClick={() => setLegalPanel("sitemap")}>Sitemap</button>
          </nav>
        </div>
        <p className="footer-disclaimer">
          Our work is provided as guidance and reference material to support your own learning and submission.
          Please follow your institution’s academic guidelines. Example images come from delivered projects and
          are shown with names and institute details removed. We are not affiliated with IEEE, Springer, Scopus,
          UGC, or any university.
        </p>
      </footer>
      {legalPanel && (
        <div className="legal-modal-backdrop" role="presentation" onClick={() => setLegalPanel(null)}>
          <section className="legal-modal" role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(event) => event.stopPropagation()}>
            <button className="legal-close" type="button" aria-label="Close legal information" onClick={() => setLegalPanel(null)}>×</button>
            <span className="eyebrow dark"><span /> ScholarVenue</span>
            <h2 id="legal-title">{legalContent[legalPanel].title}</h2>
            <p>{legalContent[legalPanel].body}</p>
            <button className="primary-button" type="button" onClick={() => setLegalPanel(null)}>Close</button>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
