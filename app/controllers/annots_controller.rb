class AnnotsController < ApplicationController
  # GET /annots
  # GET /annots.xml
  def index
    @annots = Annot.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @annots }
    end
  end

  # GET /annots/1
  # GET /annots/1.xml
  def show
    @annot = Annot.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @annot }
    end
  end

  # GET /annots/new
  # GET /annots/new.xml
  def new
    @annot = Annot.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @annot }
    end
  end

  # GET /annots/1/edit
  def edit
    @annot = Annot.find(params[:id])
  end

  # POST /annots
  # POST /annots.xml
  def create
    @annot = Annot.new(params[:annot])

    respond_to do |format|
      if @annot.save
        flash[:notice] = 'Annot was successfully created.'
        format.html { redirect_to(@annot) }
        format.xml  { render :xml => @annot, :status => :created, :location => @annot }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @annot.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /annots/1
  # PUT /annots/1.xml
  def update
    @annot = Annot.find(params[:id])

    respond_to do |format|
      if @annot.update_attributes(params[:annot])
        flash[:notice] = 'Annot was successfully updated.'
        format.html { redirect_to(@annot) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @annot.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /annots/1
  # DELETE /annots/1.xml
  def destroy
    @annot = Annot.find(params[:id])
    @annot.destroy

    respond_to do |format|
      format.html { redirect_to(annots_url) }
      format.xml  { head :ok }
    end
  end
end
