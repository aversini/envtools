/*
 * supporting JavaScript for dynamic outline
 *
 * $Id: outline.js,v 1.2 2008/01/10 23:42:11 randy Exp $
 */

/**
 * IE doesn't define the DOM-standard constants on Node. Define the
 * ones we might use so we can actually use them.
 */
if ( ! Node )
{
   var Node =
   {
      ELEMENT_NODE:           1,
      ATTRIBUTE_NODE:         2,
      TEXT_NODE:              3,
      DOCUMENT_NODE:          9,
      DOCUMENT_FRAGMENT_NODE: 11
   };
}

/**
 * Convert list of lists into expandable/collapsible outline.
 *
 * Adds various A elements with onclick handlers, and assigns various
 * classes to track the current state of each item. The companion
 * CSS file, outline.css, uses these classes to present the list as
 * an appropriately collapsed outline, so needs to be used in tandem.
 *
 * @param listElem
 *    list element to convert
 */
function makeOutline( listElem )
{
   function toggleParent()
   {
      var elem = this.parentNode;
      for ( var child = elem.firstChild ;
            child != null ;
            child = child.nextSibling )
      {
         if ( child.nodeType != Node.ELEMENT_NODE )
            continue;
         var c = child.className;
         if ( c.search( /\boutlineOpen\b/ ) != -1 )
            c = c.replace( /\boutlineOpen\b/, "outlineClosed" );
         else if ( c.search( /\boutlineClosed\b/ ) != -1 )
            c = c.replace( /\boutlineClosed\b/, "outlineOpen" );
         else
            continue;
         child.className = c;
      }
      return( false );
   }

   function enableToggles( list, level )
   {
      for ( var item = list.firstChild ;
            item != null ;
            item = item.nextSibling )
      {
         if ( item.nodeType == Node.ELEMENT_NODE
              && item.tagName == "LI" )
         {
            var hasSubList = false;
            for ( var subList = item.firstChild ;
                  subList != null ;
                  subList = subList.nextSibling )
            {
               if ( subList.nodeType == Node.ELEMENT_NODE 
                    && subList.tagName == "UL" )
               {
                  subList.className =
                     subList.className.concat( " outlineLevel" + level,
                                               " outlineClosed" );
                  enableToggles( subList, ( level + 1 ) );
                  hasSubList = true;
               }
            }

            if ( hasSubList )
            {
               var link = document.createElement( "SPAN" );
               link.className = link.className.concat( " outlineClosed" );
               link.onclick = toggleParent;
               var nodeLabel = item.firstChild;
               if ( nodeLabel.nodeType == Node.TEXT_NODE )
               {
                  link.appendChild( document.createTextNode( nodeLabel.data ) );
                  item.replaceChild( link, nodeLabel );
               }
               else
                  item.insertBefore( link, nodeLabel );
               item.className = item.className.concat( " outlineNonLeaf" );
            }
            else
               item.className = item.className.concat( " outlineLeaf" );
         }
      }
   }

   enableToggles( listElem, 1 );
   listElem.className = listElem.className.concat( " outlineLevel0" );
}

/**
 * Open or close all non-leaf nodes in an outline.
 *
 * Given the top of an outline previously processed by makeOutline(),
 * changeOutlineState() will either open or close all non-leaf child
 * nodes. The given element can actually be any child node of the
 * outline, or even a parent node to the outline, as this function
 * will simply recurse through the children looking for appropriately-
 * classed links.
 *
 * @param elem
 *    the outline node to start from
 * @param openAll
 *    true to open all nodes, false to close all nodes
 */
function changeOutlineState( listElem, openAll )
{
   if ( listElem == undefined )
      return;

   for ( var item = listElem.firstChild ;
         item != null ;
         item = item.nextSibling )
   {
      var c = item.className;
      if ( item.nodeType == Node.ELEMENT_NODE
           && item.tagName == "SPAN" 
           && item.onclick != undefined
           && c.search( /\boutline/ ) != -1 )
      {
         if ( ( openAll && c.search( /\boutlineClosed\b/ ) != -1 )
              || ( ! openAll && c.search( /\boutlineOpen\b/ ) != -1 ) )
         {
            item.onclick.call( item );
         }
      }
      else if ( item.hasChildNodes() )
         changeOutlineState( item, openAll );
   }
}
