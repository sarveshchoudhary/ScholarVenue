# Dataset Preprocessing Plan: ext_list_Jan_2026.xlsx

## Dataset Overview

- **Source**: Scopus Publication Sources (January 2026)
- **Records**: 48,151 venues (journals, conferences, series)
- **Columns**: 52 fields with publication metadata
- **Format**: Excel (.xlsx) → Will convert to CSV for processing

---

## Phase 1: Data Cleaning & Validation

### 1.1 Missing Value Handling

| Column                        | Missing % | Action                      |
| ----------------------------- | --------- | --------------------------- |
| Added to List Jan. 2026       | 99.98%    | Remove (all nulls)          |
| Related Titles (2-4)          | 95-99%    | Remove (high sparsity)      |
| Titles Discontinued by Scopus | 98%       | Remove (sparse)             |
| Medline-sourced Title         | 89%       | Fill with 'No'              |
| Open Access Status            | 81%       | Fill with 'Unknown'         |
| Articles in Press             | 79%       | Fill with 'Not Available'   |
| Title History Indication      | 73%       | Remove (low utility)        |
| EISSN                         | 37%       | Keep as optional identifier |
| ISSN                          | 12%       | Keep as primary identifier  |

### 1.2 Data Type Standardization

- `Sourcerecord ID`: Keep as integer (primary key)
- `Source Title`: Convert to lowercase for consistency
- `Active or Inactive`: Normalize to binary (Active/Inactive)
- `Coverage`: Parse date ranges (YYYY-YYYY format)
- `Open Access Status`: Standardize category values
- `Source Type`: Verify valid values (journal, conference, series, etc.)

### 1.3 Duplicate Detection

- Check for duplicate titles (different records)
- Check for duplicate ISSN/EISSN
- Flag records with identical publishers/titles

---

## Phase 2: Feature Engineering for Recommendation

### 2.1 Subject Classification

- Parse ASJC codes (All Science Journal Classification Codes)
- Extract top-level categories: Life Sciences, Social Sciences, Physical Sciences, Health Sciences
- Create subject tags from 35 ASJC code columns
- Generate subject diversity metric

### 2.2 Publisher Analysis

- Standardize publisher names
- Extract imprint information
- Create publisher profile features

### 2.3 Venue Characteristics

- **Activity Score**: Based on Active/Inactive status and coverage recency
- **Coverage Span**: Calculate years of publication coverage
- **Language Profile**: Primary language distribution
- **Accessibility Score**: Based on Open Access status
- **Documentation Level**: Based on metadata completeness

---

## Phase 3: Data Filtering & Subsets

### 3.1 Primary Dataset

- Filter: Active venues only
- Keep: Essential columns for matching
- Size: ~30,000-35,000 active venues

### 3.2 Categorical Subsets

- **By Source Type**: Journals, Conferences, Series
- **By Region**: Top publishers by country
- **By Subject**: By ASJC code
- **By Access**: Open Access vs Restricted

### 3.3 Quality Tiers

- **Tier 1 (Premium)**: Complete metadata + high citation impact
- **Tier 2 (Standard)**: Good metadata coverage
- **Tier 3 (Emerging)**: Newer venues, limited history

---

## Phase 4: CSV Export & Format

### 4.1 Output Files

```
datasets/
├── ext_venues_full.csv          # All 48,151 records
├── ext_venues_active.csv         # Active venues only (~35k)
├── ext_venues_by_subject.csv     # With subject categorization
└── ext_venues_metadata.json      # Structured venue metadata
```

### 4.2 Column Selection for Main Dataset

Essential columns:

- `Sourcerecord ID` (unique identifier)
- `Source Title` (venue name)
- `ISSN` / `EISSN` (identifiers)
- `Source Type` (journal/conference/series)
- `Publisher` (organization)
- `Active or Inactive` (status)
- `Open Access Status` (accessibility)
- `Subject Categories` (from ASJC codes)
- `Coverage` (publication years)
- All 35 ASJC subject code columns

---

## Phase 5: Integration with Recommendation System

### 5.1 Updates to `recommender.py`

- Update `load_venue_database()` to use new dataset
- Enhance domain matching with 35 ASJC categories
- Add publisher matching logic
- Implement subject-based filtering

### 5.2 Updates to `app.py`

- Replace `arxiv_clean.csv` reference with `ext_venues_active.csv`
- Update feature extraction to match new schema
- Implement venue metadata caching

### 5.3 Updates to Frontend

- Display additional metadata (Open Access, Publisher, ISSN)
- Add subject filtering options
- Show venue type (Journal/Conference/Series)

---

## Phase 6: Quality Assurance

### 6.1 Validation Checks

- [ ] All IDs are unique
- [ ] Title field populated (0% nulls)
- [ ] Source Type is valid category
- [ ] ISSN format validation (8-10 digits with hyphens)
- [ ] Publisher field completeness
- [ ] Date ranges logical and valid

### 6.2 Data Profiling

- Record count per source type
- Distribution of open access status
- Subject category coverage
- Publisher concentration

### 6.3 Testing

- Unit tests for preprocessing functions
- Integration tests with recommendation engine
- Sample recommendations validation

---

## Implementation Steps

1. **Convert Excel to CSV**: Run preprocessing script
2. **Data Cleaning**: Apply transformation rules
3. **Feature Engineering**: Create subject tags and metadata
4. **Generate Subsets**: Create filtered datasets
5. **Update Code**: Modify app.py and recommender.py
6. **Integration Testing**: Test with sample papers
7. **Backup Old Data**: Archive arxiv_clean.csv and related files

---

## Expected Outcomes

- **Clean Dataset**: 48,000+ standardized venue records
- **Subject Coverage**: 35 ASJC categories for precise matching
- **Recommendation Quality**: Improved accuracy with comprehensive metadata
- **Performance**: Faster lookups with indexed venue database

---

## Timeline

- Phase 1-2: Data cleaning & feature engineering (automated)
- Phase 3-4: Filtering, export, and formatting (automated)
- Phase 5-6: Code integration & testing (manual + automated)
