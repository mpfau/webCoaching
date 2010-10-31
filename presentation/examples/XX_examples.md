!SLIDE 
# Javascript and CSS introduction #

## Matthias Pfau
## Zühlke Engineering GmbH

!SLIDE bullets incremental
# Bullet Points #

* first point
* second point
* third point

!SLIDE code smallest
    @@@ ruby
		class Person
			attr_reader :name, :age
			def initialize(name, age)
				@name, @age = name, age
			end
			def <=>(person) # Comparison operator for sorting
				@age <=> person.age
			end
			def to_s
				"#@name (#@age)"
			end
		end

!SLIDE code smallest
    @@@ javascript
    function foo() {
      return 'bar';
    }

!SLIDE code smallest
    @@@ java
    public void test() {
				throw new RuntimeException();
		}

!SLIDE code smallest
  	@@@ css
	body {
		font-family: "AA Zuehlke", Helvetica;
	}

!SLIDE code smallest
    @@@ruby
    def available_products_init
      params[:category] = parse_category(params[:category])
      
      popular_sales, popular_xxxx, weekly, monthly = parse_popularity(params[:popularity])
      set_params_to_i( [:popularity, :size, :artist, :color_category] ) 
      
      scope, conditions = {}, {}
      conditions.merge!('xxxxs.xxxx_category_id' => params[:category]) unless params[:category].blank?
      conditions.merge!('xxxxs.xxxx_size_id'     => params[:size])     unless params[:size].blank?
      conditions.merge!('xxxxs.user_account_id'      => params[:artist])   unless params[:artist].blank?
      conditions.merge!(ColorCategory.get_color_filter_from_color_category(params[:color_category])) unless params[:color_category].blank?
    
      scope.merge!(:conditions => conditions) unless conditions.blank?
      scope.merge!(:having => 'count(xxxxs.id) >= 3') if params[:size].blank?
      scope.merge!(Xxxxx.compute_ordering_for_lookup(params[:sort], popular_sales))
    
      all_available_xxxxs = Xxxxx.available_month_winners(scope)   if monthly && popular_xxxx
      all_available_xxxxs = Xxxxx.available_week_winners(scope)    if weekly  && popular_xxxx
      all_available_xxxxs = Xxxxx.available_monthly_sellers(scope) if monthly && popular_sales
      all_available_xxxxs = Xxxxx.available_weekly_sellers(scope)  if weekly  && popular_sales
      all_available_xxxxs = Xxxxx.available_xxxxs(scope)         if !popular_sales && !popular_xxxx
    
      @all_available_xxxxs = all_available_xxxxs.uniq
    end

