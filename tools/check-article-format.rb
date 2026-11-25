# Run after bundle exec jekyll build. Check the pages readers actually receive.
require "nokogiri"
require "yaml"
require "date"
require "uri"

root = ARGV.fetch(0, "_site")
errors = []
articles = 0
long_articles = 0

posts = Dir.glob("_posts/*").sort
slugs = posts.map { |path| File.basename(path, ".*")[11..] }
posts.each do |path|
  fields = YAML.safe_load(File.read(path, encoding: "bom|utf-8").split(/^---\s*$/, 3).fetch(1), permitted_classes: [Date, Time])
  next unless fields["layout"] == "article" && fields["published"] != false
  slug = File.basename(path, ".*")[11..]
  route = fields["permalink"] || "/#{Array(fields["categories"]).join("/")}/#{slug}/"
  file = File.join(root, route, "index.html")
  unless File.file?(file)
    errors << "#{route} missing built page"
    next
  end
  page = Nokogiri::HTML(File.read(file, encoding: "UTF-8"))
  body = page.at_css(".post-content")
  articles += 1
  errors << "#{route} article body or title" unless body && page.css("main h1").size == 1
  next unless body
  %w[seo_title description tags keywords cta_context cover_image cover_alt].each do |field|
    errors << "#{route} missing #{field}" if Array(fields[field]).all? { |value| value.to_s.strip.empty? }
  end
  errors << "#{route} description exceeds 80 characters" if fields["description"].to_s.size > 80
  related = Array(fields["related_posts"])
  errors << "#{route} invalid related posts" unless related.empty? || (related.uniq.size == 3 && (related - slugs).empty? && !related.include?(slug))
  cards = page.css(".related-posts .card-title a").map { |link| link["href"] }
  errors << "#{route} expected three distinct related cards" unless cards.uniq.size == 3 && !cards.include?(route)
  %w[.article-meta .share-buttons .author-bio .article-cta .related-posts .article-footer-nav].each do |selector|
    errors << "#{route} missing #{selector}" unless page.at_css(selector)
  end
  body.css("img[src]").each do |image|
    src = URI::DEFAULT_PARSER.unescape(image["src"].split(/[?#]/).first.to_s)
    errors << "#{route} missing inline image #{src}" if src.start_with?("/") && !src.start_with?("//") && !File.file?(File.join(root, src))
    errors << "#{route} image lacks alt attribute" unless image.key?("alt")
  end
  next if fields["source_url"] || fields["source_url_x"]
  if body.css("h2").size >= 5
    long_articles += 1
    outlines = body.css("nav.article-toc.article-toc--outline")
    summaries = body.css(".article-tldr")
    errors << "#{route} expected one grouped outline" unless outlines.size == 1 && outlines.first.css(".article-toc-part .article-toc-items").size >= 2
    errors << "#{route} expected one summary of 3–5 points" unless summaries.size == 1 && (3..5).cover?(summaries.first.css("li").size)
  end
  ids = page.css("[id]").map { |node| node["id"] }.tally
  body.css('a[href^="#"]').each do |link|
    target = URI::DEFAULT_PARSER.unescape(link["href"][1..])
    errors << "#{route} ambiguous or missing ##{target}" unless target.empty? || ids[target] == 1
  end
  body.css("h2").select { |h| h.text.match?(/參考資料|參考來源|參考文獻|原始資料與查核方式/) }.each do |heading|
    section = heading.xpath("following-sibling::*").take_while { |node| node.name != "h2" }
    list = section.find { |node| %w[ol ul].include?(node.name) }
    next unless list
    list.xpath("./li").each_with_index do |item, index|
      errors << "#{route} reference #{index + 1} needs a numbered label and link" unless item.at_css("strong")&.text == "[#{index + 1}]" && item.at_css("a[href]")
    end
  end
end

puts "#{articles} articles, #{long_articles} original long articles, #{errors.size} format errors"
abort errors.join("\n") unless errors.empty?
