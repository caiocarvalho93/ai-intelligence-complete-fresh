-- Seed the countries list with the primary launch markets.
INSERT INTO cai_countries (code, name) VALUES
  ('us','United States'),
  ('br','Brazil'),
  ('gb','United Kingdom'),
  ('ca','Canada'),
  ('de','Germany'),
  ('fr','France'),
  ('es','Spain'),
  ('it','Italy'),
  ('nl','Netherlands'),
  ('se','Sweden'),
  ('no','Norway')
ON CONFLICT (code) DO NOTHING;
